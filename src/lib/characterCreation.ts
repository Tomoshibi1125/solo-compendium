/**
 * Character creation automation
 * Handles automatic feature/equipment/power addition from compendium
 */

import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import {
  addLocalEquipment,
  addLocalFeature,
  addLocalPower,
  isLocalCharacterId,
} from '@/lib/guestStore';
import {
  filterRowsBySourcebookAccess,
  getCharacterCampaignId,
  isSourcebookAccessible,
} from '@/lib/sourcebookAccess';
import { calculateFeatureUses } from '@/lib/automation';
import { jobs as staticJobs } from '@/data/compendium/jobs';
import { items as staticItems } from '@/data/compendium/items';
import { backgrounds as staticBackgrounds } from '@/data/compendium/backgrounds';

type Job = Database['public']['Tables']['compendium_jobs']['Row'];
type Background = Database['public']['Tables']['compendium_backgrounds']['Row'];

type StaticJob = (typeof staticJobs)[number];
type StaticBackground = (typeof staticBackgrounds)[number];

function normalizeItemLookupName(value: string): string {
  return value
    .trim()
    .replace(/^a\s+/i, '')
    .replace(/^an\s+/i, '')
    .replace(/^a\s+set\s+of\s+/i, '')
    .replace(/^set\s+of\s+/i, '')
    .replace(/^a\s+pair\s+of\s+/i, '')
    .replace(/^pair\s+of\s+/i, '')
    .trim()
    .toLowerCase();
}

function findStaticItemByName(itemName: string): (typeof staticItems)[number] | null {
  const normalized = normalizeItemLookupName(itemName);

  // Exact match first
  const exact = staticItems.find((i) => normalizeItemLookupName(i.name) === normalized) ?? null;
  if (exact) return exact;

  // Fuzzy fallback: background equipment strings often include adjectives ("portable", "high-end", etc.)
  // so we do a conservative contains check.
  return (
    staticItems.find((i) => {
      const n = normalizeItemLookupName(i.name);
      return normalized.includes(n) || n.includes(normalized);
    }) ?? null
  );
}

function findStaticBackgroundByName(backgroundName: string | null | undefined): StaticBackground | null {
  if (!backgroundName) return null;
  const normalized = backgroundName.trim().toLowerCase();
  return staticBackgrounds.find((b) => b.name.trim().toLowerCase() === normalized) ?? null;
}

function splitCompoundEquipmentEntry(entry: string): string[] {
  const trimmed = entry.trim();
  if (!trimmed) return [];

  // Handle common compound phrasing from modern backgrounds.
  // Example: "A ring light and portable camera"
  if (trimmed.toLowerCase().includes(' and ')) {
    return trimmed
      .split(/\s+and\s+/i)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  return [trimmed];
}

function deriveItemType(item: (typeof staticItems)[number]): string {
  if (item.item_type) return item.item_type;
  const t = item.type?.toLowerCase() ?? '';
  if (t === 'weapon') return 'weapon';
  if (t === 'armor') return 'armor';
  if (t === 'consumable') return 'consumable';
  if (t === 'scroll' || t === 'wand' || t === 'staff') return 'tool';
  return 'misc';
}

function findStaticJobByName(jobName: string | null | undefined): StaticJob | null {
  if (!jobName) return null;
  const normalized = jobName.trim().toLowerCase();
  return staticJobs.find((j) => j.name.trim().toLowerCase() === normalized) ?? null;
}

/**
 * Build a properties string array from a static compendium item's mechanical fields.
 * The equipmentModifiers.ts parser reads these strings to apply AC, damage, etc.
 */
function buildItemProperties(item: (typeof staticItems)[number]): string[] {
  const props: string[] = [];

  // Armor: emit "AC <value>" so the modifier parser picks it up
  if (item.armor_class) {
    if (item.armor_type === 'Shield') {
      props.push('+2 AC');
    } else {
      // e.g. "16" from "16", or "14 + Dex modifier (max 2)" → extract leading number
      const acNum = parseInt(item.armor_class);
      if (!isNaN(acNum) && acNum > 10) {
        props.push(`AC ${acNum}`);
      }
    }
    if (item.armor_type) props.push(item.armor_type);
  }
  if (item.stealth_disadvantage) props.push('Stealth disadvantage');
  if (item.strength_requirement) props.push(`Requires STR ${item.strength_requirement}`);

  // Weapon: damage string
  if (item.damage && item.damage_type) {
    props.push(`${item.damage} ${item.damage_type}`);
  }
  if (item.weapon_type) props.push(item.weapon_type);
  if (item.simple_properties) {
    props.push(...item.simple_properties);
  }
  if (item.range && item.range !== 'Melee') props.push(`Range ${item.range}`);

  const passive = (item.effects as any)?.passive;
  if (Array.isArray(passive)) {
    for (const line of passive) {
      if (typeof line === 'string' && line.trim().length > 0) {
        props.push(line.trim());
      }
    }
  }

  return props;
}

function isChoiceFeatureText(value: string | null | undefined): boolean {
  if (!value) return false;
  return /\b(choose|select|pick)\b/i.test(value);
}

function isChoiceFeatureRow(feature: {
  name?: string | null;
  description?: string | null;
  prerequisites?: string | null;
}): boolean {
  return (
    isChoiceFeatureText(feature.name ?? null) ||
    isChoiceFeatureText(feature.description ?? null) ||
    isChoiceFeatureText(feature.prerequisites ?? null)
  );
}

type SpellProgression = 'none' | 'full' | 'half' | 'pact';

function normalizeJobName(jobName: string | null | undefined): string {
  return (jobName || '').trim().toLowerCase();
}

function getSpellProgressionForJob(jobName: string | null | undefined): SpellProgression {
  const normalized = normalizeJobName(jobName);

  // Full casters
  const fullCasters = ['mage', 'revenant', 'herald', 'esper', 'summoner', 'idol'];
  if (fullCasters.includes(normalized)) return 'full';

  // Half casters
  const halfCasters = ['holy knight', 'stalker', 'technomancer'];
  if (halfCasters.includes(normalized)) return 'half';

  // Pact caster
  if (normalized === 'contractor') return 'pact';

  return 'none';
}

/**
 * 5e-accurate max spell level unlocked for a class at a given level.
 * We use this to gate compendium powers (treating `power_level` like spell level).
 */
export function getMaxPowerLevelForJobAtLevel(
  jobName: string | null | undefined,
  level: number
): number {
  const clamped = Math.min(Math.max(level, 1), 20);
  const progression = getSpellProgressionForJob(jobName);

  if (progression === 'none') return 0;

  if (progression === 'pact') {
    if (clamped >= 9) return 5;
    if (clamped >= 7) return 4;
    if (clamped >= 5) return 3;
    if (clamped >= 3) return 2;
    return 1;
  }

  if (progression === 'half') {
    if (clamped >= 17) return 5;
    if (clamped >= 13) return 4;
    if (clamped >= 9) return 3;
    if (clamped >= 5) return 2;
    if (clamped >= 2) return 1;
    return 0;
  }

  // full caster
  if (clamped >= 17) return 9;
  if (clamped >= 15) return 8;
  if (clamped >= 13) return 7;
  if (clamped >= 11) return 6;
  if (clamped >= 9) return 5;
  if (clamped >= 7) return 4;
  if (clamped >= 5) return 3;
  if (clamped >= 3) return 2;
  return 1;
}

async function getExistingFeatureNames(characterId: string): Promise<Set<string>> {
  if (isLocalCharacterId(characterId)) {
    const { listLocalFeatures } = await import('@/lib/guestStore');
    return new Set(listLocalFeatures(characterId).map((f) => f.name));
  }

  const { data } = await supabase
    .from('character_features')
    .select('name')
    .eq('character_id', characterId);

  return new Set((data || []).map((row) => row.name));
}

async function insertCharacterFeature(
  characterId: string,
  payload: Omit<Database['public']['Tables']['character_features']['Insert'], 'character_id'>
): Promise<void> {
  if (isLocalCharacterId(characterId)) {
    addLocalFeature(characterId, {
      name: payload.name,
      source: payload.source ?? undefined,
      level_acquired: payload.level_acquired ?? undefined,
      description: payload.description ?? undefined,
      action_type: payload.action_type ?? null,
      uses_max: payload.uses_max ?? null,
      uses_current: payload.uses_current ?? null,
      recharge: payload.recharge ?? null,
      is_active: payload.is_active ?? true,
      modifiers: (payload as any).modifiers ?? null,
      homebrew_id: (payload as any).homebrew_id ?? null,
    });
    return;
  }

  await supabase.from('character_features').insert({
    character_id: characterId,
    ...payload,
  });
}

async function updateCharacterFeatureModifiersByName(
  characterId: string,
  name: string,
  modifiers: FeatureModifier[] | null,
): Promise<void> {
  if (isLocalCharacterId(characterId)) {
    const { listLocalFeatures, updateLocalFeature } = await import('@/lib/guestStore');
    const local = listLocalFeatures(characterId);
    const existing = local.find((f: { name?: string | null; id: string }) => f.name === name);
    if (!existing) return;
    updateLocalFeature(existing.id, { modifiers: modifiers as any });
    return;
  }

  await supabase
    .from('character_features')
    .update({ modifiers: modifiers as any })
    .eq('character_id', characterId)
    .eq('name', name);
}

type FeatureModifier = {
  type: string;
  value: number;
  target?: string;
  source: string;
};

function getJobTraitModifiers(jobName: string, traitName: string): FeatureModifier[] {
  const job = jobName.trim().toLowerCase();
  const trait = traitName.trim().toLowerCase();

  // 1. DESTROYER
  if (job === 'destroyer') {
    if (trait === 'gate breaker') {
      return [{ type: 'advantage', value: 0, target: 'save:fear', source: traitName }];
    }
    if (trait === 'combat telemetry') {
      // Bonus action scan: advantage on Investigation checks
      return [{ type: 'advantage', value: 0, target: 'skill:investigation', source: traitName }];
    }
  }

  // 2. BERSERKER
  if (job === 'berserker') {
    if (trait === 'threat reflex') {
      return [{ type: 'advantage', value: 0, target: 'AGI_saves', source: traitName }];
    }
    if (trait === 'predator instinct') {
      return [{ type: 'advantage', value: 0, target: 'initiative', source: traitName }];
    }
    if (trait === 'mana intimidation') {
      return [{ type: 'save_dc_bonus', value: 0, target: 'PRE', source: traitName }];
    }
  }

  // 3. ASSASSIN
  if (job === 'assassin') {
    if (trait === 'dimensional sight') {
      return [{ type: 'advantage', value: 0, target: 'skill:perception_hearing', source: traitName }];
    }
    if (trait === 'ghost walk') {
      return [{ type: 'advantage', value: 0, target: 'skill:stealth', source: traitName }];
    }
  }

  // 4. STRIKER
  if (job === 'striker') {
    if (trait === 'impulse sense') {
      return [{ type: 'advantage', value: 0, target: 'skill:perception', source: traitName }];
    }
  }

  // 5. MAGE
  if (job === 'mage') {
    if (trait === 'arcane sight') {
      return [{ type: 'advantage', value: 0, target: 'skill:arcana', source: traitName }];
    }
    if (trait === 'spell resistance matrix') {
      return [{ type: 'resistance', value: 0, target: 'psychic', source: traitName }];
    }
  }

  // 6. ESPER
  if (job === 'esper') {
    if (trait === 'mana sensitivity') {
      return [{ type: 'advantage', value: 0, target: 'skill:arcana', source: traitName }];
    }
    if (trait === 'anomalous resistance') {
      return [{ type: 'advantage', value: 0, target: 'save:charm', source: traitName }];
    }
  }

  // 7. REVENANT
  if (job === 'revenant') {
    if (trait === 'necrotic shell') {
      return [{ type: 'resistance', value: 0, target: 'necrotic', source: traitName }];
    }
  }

  // 8. SUMMONER
  if (job === 'summoner') {
    if (trait === 'biome link') {
      return [{ type: 'advantage', value: 0, target: 'skill:animal_handling', source: traitName }];
    }
    if (trait === 'toxin resistance') {
      return [
        { type: 'advantage', value: 0, target: 'save:poison', source: traitName },
        { type: 'resistance', value: 0, target: 'poison', source: traitName }
      ];
    }
  }

  // 9. HERALD
  if (job === 'herald') {
    if (trait === 'entity detection') {
      return [{ type: 'advantage', value: 0, target: 'skill:religion', source: traitName }];
    }
    if (trait === 'signal hardening') {
      return [
        { type: 'resistance', value: 0, target: 'necrotic', source: traitName },
        { type: 'resistance', value: 0, target: 'radiant', source: traitName },
        { type: 'advantage', value: 0, target: 'save:hp_reduction', source: traitName }
      ];
    }
  }

  // 10. CONTRACTOR
  if (job === 'contractor') {
    if (trait === 'contract protection') {
      return [{ type: 'advantage', value: 0, target: 'save:charm', source: traitName }];
    }
  }

  // 11. STALKER
  if (job === 'stalker') {
    if (trait === 'gate navigator') {
      return [{ type: 'advantage', value: 0, target: 'save:gate_hazard', source: traitName }];
    }
  }

  // 12. HOLY KNIGHT
  if (job === 'holy-knight') {
    if (trait === 'oath ward') {
      return [{ type: 'save_bonus', value: 0, target: 'PRE_mod', source: traitName }];
    }
  }

  // 13. TECHNOMANCER
  if (job === 'technomancer') {
    if (trait === 'tool mastery') {
      return [{ type: 'expertise', value: 0, target: 'all_tools', source: traitName }];
    }
    if (trait === 'system assist') {
      return [{ type: 'bonus', value: 0, target: 'INT_mod', source: traitName }];
    }
  }

  // 14. IDOL
  if (job === 'idol') {
    if (trait === 'system versatility') {
      return [{ type: 'jack_of_all_trades', value: 0, target: 'ability_checks', source: traitName }];
    }
    if (trait === 'specialist training') {
      return [{ type: 'expertise', value: 0, target: 'choice:2', source: traitName }];
    }
  }

  return [];
}

function getJobAwakeningFeatureModifiers(jobName: string, featureName: string, level: number): FeatureModifier[] {
  const job = jobName.trim().toLowerCase();
  const feature = featureName.trim().toLowerCase();

  // 1. DESTROYER
  if (job === 'destroyer') {
    if (feature === 'reinforced frame') {
      return [{ type: 'death_save_success_regain_hp', value: 1, target: 'self', source: featureName }];
    }
    if (feature === 'system targeting hud') {
      return [
        { type: 'advantage', value: 0, target: 'initiative', source: featureName },
        { type: 'crit_die_count', value: 1, target: 'weapon', source: featureName }
      ];
    }
    if (feature === 'adrenal regulator') {
      return [{ type: 'damage', value: 0, target: 'force:1d4', source: featureName }];
    }
    if (feature === 'weapon neural bond') {
      const bonus = level >= 17 ? 2 : 1;
      return [
        { type: 'attack', value: bonus, target: 'melee', source: featureName },
        { type: 'damage', value: bonus, target: 'melee', source: featureName },
        { type: 'attack', value: bonus, target: 'ranged', source: featureName },
        { type: 'damage', value: bonus, target: 'ranged', source: featureName },
        { type: 'disarm_immunity', value: 0, target: 'self', source: featureName }
      ];
    }
  }

  // 2. BERSERKER
  if (job === 'berserker') {
    if (feature === 'mana-dense physiology') {
      return [{ type: 'hp-max', value: level, target: null as any, source: featureName }];
    }
    if (feature === 'toxin purge') {
      return [
        { type: 'advantage', value: 0, target: 'save:poison', source: featureName },
        { type: 'resistance', value: 0, target: 'poison', source: featureName }
      ];
    }
    if (feature === 'feedback frenzy') {
      return [{ type: 'disadvantage', value: 0, target: 'ability_checks', source: featureName }];
    }
    if (feature === 'mana saturation') {
      return [
        { type: 'resistance', value: 0, target: 'all_but_psychic', source: featureName },
        { type: 'unconscious_immunity_if_hp_above_0', value: 0, target: 'self', source: featureName }
      ];
    }
    if (feature === 'unstable discharge') {
      return [{ type: 'damage', value: 0, target: 'force:1d6', source: featureName }];
    }
  }

  // 3. ASSASSIN
  if (job === 'assassin') {
    if (feature === 'phase-shifted mind') {
      return [
        { type: 'advantage', value: 0, target: 'save:charm', source: featureName },
        { type: 'immunity', value: 0, target: 'magical_sleep', source: featureName }
      ];
    }
    if (feature === 'shadow phase') {
      return [{ type: 'advantage', value: 0, target: 'attack_after_teleport', source: featureName }];
    }
    if (feature === 'lethal geometry') {
      const dieCount = level >= 13 ? 2 : 1;
      return [{ type: 'damage', value: 0, target: `force:${dieCount}d6`, source: featureName }];
    }
    if (feature === 'kill designation') {
      return [{ type: 'crit_threshold', value: 19, target: 'designated_target', source: featureName }];
    }
  }

  // 4. STRIKER
  if (job === 'striker') {
    if (feature === 'neural overclock') {
      return [{ type: 'reroll_ones', value: 0, target: 'self', source: featureName }];
    }
    if (feature === 'fluid physiology') {
      return [
        { type: 'move_through_larger', value: 0, target: 'self', source: featureName },
        { type: 'prone_immunity', value: 0, target: 'self', source: featureName }
      ];
    }
    if (feature === 'impulse sense') {
      return [{ type: 'blindsight', value: 120, target: 'self', source: featureName }];
    }
    if (feature === 'autonomic mastery') {
      return [{ type: 'walk_on_liquids', value: 0, target: 'self', source: featureName }];
    }
    if (feature === 'force channeling') {
      return [{ type: 'damage', value: 0, target: 'force:1d4', source: featureName }];
    }
  }

  // 5. MAGE
  if (job === 'mage') {
    if (feature === 'mana-shielded cortex') {
      return [
        { type: 'advantage', value: 0, target: 'save:INT', source: featureName },
        { type: 'advantage', value: 0, target: 'save:SENSE', source: featureName },
        { type: 'advantage', value: 0, target: 'save:PRE', source: featureName }
      ];
    }
    if (feature === 'system read access') {
      return [{ type: 'advantage', value: 0, target: 'skill:arcana', source: featureName }];
    }
    if (feature === 'real-time decompilation') {
      return [{ type: 'advantage', value: 0, target: 'save:spells', source: featureName }];
    }
  }

  // 6. ESPER
  if (job === 'esper') {
    if (feature === 'mana-saturated body') {
      return [{ type: 'hp-max', value: level, target: null as any, source: featureName }];
    }
    if (feature === 'willpower amplifier') {
      return [{ type: 'damage', value: 0, target: 'force:PRE_mod', source: featureName }];
    }
  }

  // 7. REVENANT
  if (job === 'revenant') {
    if (feature === 'reconstructed biology') {
      return [
        { type: 'immunity', value: 0, target: 'disease', source: featureName },
        { type: 'no_breathing', value: 0, target: 'self', source: featureName }
      ];
    }
    if (feature === 'death\'s threshold') {
      return [
        { type: 'advantage', value: 0, target: 'save:death', source: featureName },
        { type: 'immunity', value: 0, target: 'frightened', source: featureName }
      ];
    }
    if (feature === 'life siphon') {
      return [{ type: 'hp-regain', value: 0.5, target: 'necrotic_damage_dealt', source: featureName }];
    }
  }

  // 8. SUMMONER
  if (job === 'summoner') {
    if (feature === 'biome attunement') {
      return [
        { type: 'advantage', value: 0, target: 'save:poison', source: featureName },
        { type: 'advantage', value: 0, target: 'save:disease', source: featureName },
        { type: 'resistance', value: 0, target: 'poison', source: featureName }
      ];
    }
    if (feature === 'gate ecology sense') {
      return [{ type: 'advantage', value: 0, target: 'skill:nature', source: featureName }];
    }
    if (feature === 'stabilized entity shift') {
      return [{ type: 'hp-temp', value: level, target: 'shift', source: featureName }];
    }
    if (feature === 'reinforced summons') {
      return [
        { type: 'hp-max', value: 0, target: 'summons:prof', source: featureName },
        { type: 'damage', value: 0, target: 'summons:1d4_force', source: featureName }
      ];
    }
  }

  // 9. HERALD
  if (job === 'herald') {
    if (feature === 'restoration protocol') {
      return [{ type: 'hp-regain', value: level, target: 'self', source: featureName }];
    }
    if (feature === 'system uplink') {
      return [{ type: 'hp-regain', value: 0, target: '1d8_SENSE', source: featureName }];
    }
    if (feature === 'broadcast aura') {
      const bonus = level >= 11 ? 2 : 1;
      return [{ type: 'save_bonus', value: bonus, target: 'all', source: featureName }];
    }
  }

  // 10. CONTRACTOR
  if (job === 'contractor') {
    if (feature === 'pact-warded mind') {
      return [{ type: 'advantage', value: 0, target: 'save:charm', source: featureName }];
    }
    if (feature === 'entity awareness') {
      return [{ type: 'advantage', value: 0, target: 'skill:insight', source: featureName }];
    }
    if (feature === 'empowered conduit') {
      return [
        { type: 'damage', value: 0, target: 'force:PRE_mod', source: featureName },
        { type: 'push', value: 10, target: 'target', source: featureName }
      ];
    }
    if (feature === 'patron\'s boon') {
      return [{ type: 'resistance', value: 0, target: 'choice', source: featureName }];
    }
  }

  // 11. STALKER
  if (job === 'stalker') {
    if (feature === 'predator physiology') {
      return [
        { type: 'advantage', value: 0, target: 'skill:perception_hearing', source: featureName },
        { type: 'advantage', value: 0, target: 'skill:perception_smell', source: featureName }
      ];
    }
    if (feature === 'enhanced locomotion') {
      return [{ type: 'speed', value: 5, target: 'walking', source: featureName }];
    }
    if (feature === 'prey lock') {
      return [{ type: 'advantage', value: 0, target: 'skill:survival_track', source: featureName }];
    }
    if (feature === 'terrain adaptation') {
      return [{ type: 'initiative_advantage', value: 0, target: 'favored_terrain', source: featureName }];
    }
    if (feature === 'apex instinct') {
      return [{ type: 'damage', value: 0, target: 'prof', source: featureName }];
    }
  }

  // 12. HOLY KNIGHT
  if (job === 'holy-knight') {
    if (feature === 'covenant bond') {
      return [{ type: 'hp-regain', value: 1, target: 'death_save_success', source: featureName }];
    }
    if (feature === 'oath sense') {
      return [{ type: 'advantage', value: 0, target: 'skill:perception_entity', source: featureName }];
    }
    if (feature === 'aura of resolve') {
      return [{ type: 'immunity', value: 0, target: 'frightened', source: featureName }];
    }
    if (feature === 'purification touch') {
      return [{ type: 'dispel_magic', value: 0, target: 'touch', source: featureName }];
    }
  }

  // 13. TECHNOMANCER
  if (job === 'technomancer') {
    if (feature === 'blueprint vision') {
      return [{ type: 'expertise', value: 0, target: 'skill:INT_magic_items', source: featureName }];
    }
    if (feature === 'system write access') {
      return [{ type: 'advantage', value: 0, target: 'skill:INT_analyze_tech', source: featureName }];
    }
    if (feature === 'infusion optimization') {
      const bonus = level >= 14 ? 2 : 1;
      return [{ type: 'item_bonus', value: bonus, target: 'infusion', source: featureName }];
    }
    if (feature === 'construct reinforcement') {
      return [{ type: 'hp-max-summons', value: level * 2, target: 'constructs', source: featureName }];
    }
  }

  // 14. IDOL
  if (job === 'idol') {
    if (feature === 'broad-spectrum awakening') {
      return [{ type: 'proficiency', value: 0, target: 'choice:2', source: featureName }];
    }
    if (feature === 'resonance shield') {
      return [
        { type: 'advantage', value: 0, target: 'save:charm', source: featureName },
        { type: 'immunity', value: 0, target: 'magical_sleep', source: featureName }
      ];
    }
    if (feature === 'amplified hype') {
      return [{ type: 'hp-temp', value: 0, target: 'PRE_mod', source: featureName }];
    }
    if (feature === 'resonance lock') {
      return [{ type: 'hype_recovery_on_max', value: 1, target: 'self', source: featureName }];
    }
  }

  return [];
}

/**
 * Map from 5e ability names (used in static job data) to System Ascendant ability names.
 */
const JOB_ASI_TO_SYSTEM: Record<string, string> = {
  strength: 'STR',
  dexterity: 'AGI',
  constitution: 'VIT',
  intelligence: 'INT',
  wisdom: 'SENSE',
  charisma: 'PRE',
};

/**
 * Get the ability score improvements for a job, mapped to System Ascendant ability names.
 * Returns a Record like { STR: 2, VIT: 1 }.
 */
export function getJobASI(
  jobName: string | null | undefined
): Record<string, number> {
  const job = findStaticJobByName(jobName);
  if (!job || !job.abilityScoreImprovements) return {};

  const result: Record<string, number> = {};
  for (const [ability, bonus] of Object.entries(job.abilityScoreImprovements)) {
    const systemAbility = JOB_ASI_TO_SYSTEM[ability.toLowerCase()];
    if (systemAbility && typeof bonus === 'number' && bonus !== 0) {
      result[systemAbility] = bonus;
    }
  }
  return result;
}

/**
 * Grant job awakening benefits (awakening features + job traits) at a specific level.
 */
export async function addJobAwakeningBenefitsForLevel(
  characterId: string,
  jobName: string | null | undefined,
  level: number
): Promise<void> {
  const job = findStaticJobByName(jobName);
  if (!job) return;

  const existingNames = await getExistingFeatureNames(characterId);

  // Handle scaling awakening features that need to update with character level.
  if (job.name.trim().toLowerCase() === 'berserker' && existingNames.has('Mana-Dense Physiology')) {
    const next = getJobAwakeningFeatureModifiers(job.name, 'Mana-Dense Physiology', level);
    await updateCharacterFeatureModifiersByName(characterId, 'Mana-Dense Physiology', next.length > 0 ? next : null);
  }

  const awakeningAtLevel = (job.awakeningFeatures || []).filter((f) => f.level === level);
  for (const feature of awakeningAtLevel) {
    if (existingNames.has(feature.name)) continue;

    const modifiers = getJobAwakeningFeatureModifiers(job.name, feature.name, level);
    await insertCharacterFeature(characterId, {
      name: feature.name,
      source: `Job Awakening: ${job.name}`,
      level_acquired: level,
      description: feature.description,
      is_active: true,
      modifiers: modifiers.length > 0 ? (modifiers as any) : null,
    });
  }

  if (level === 1) {
    for (const trait of job.jobTraits || []) {
      if (existingNames.has(trait.name)) continue;

      const modifiers = getJobTraitModifiers(job.name, trait.name);
      const isActiveByDefault = trait.type !== 'active';
      await insertCharacterFeature(characterId, {
        name: trait.name,
        source: `Job Trait: ${job.name}`,
        level_acquired: 1,
        description: trait.description,
        is_active: isActiveByDefault,
        modifiers: modifiers.length > 0 ? (modifiers as any) : null,
      });
    }
  }
}

/**
 * Add level 1 features from job to character
 */
export async function addLevel1Features(
  characterId: string,
  jobId: string,
  pathId?: string
): Promise<void> {
  const campaignId = await getCharacterCampaignId(characterId);

  // Get level 1 job features
  const { data: jobFeatures } = await supabase
    .from('compendium_job_features')
    .select('*')
    .eq('job_id', jobId)
    .eq('level', 1)
    .eq('is_path_feature', false);

  const accessibleJobFeatures = await filterRowsBySourcebookAccess(
    jobFeatures || [],
    (feature) => feature.source_name,
    { campaignId }
  );

  if (accessibleJobFeatures.length > 0) {
    for (const feature of accessibleJobFeatures) {
      const usesMax = calculateFeatureUses(feature.uses_formula, 1, 2);

      if (isLocalCharacterId(characterId)) {
        addLocalFeature(characterId, {
          name: feature.name,
          source: 'Job: Level 1',
          level_acquired: 1,
          description: feature.description,
          action_type: feature.action_type || null,
          uses_max: usesMax,
          uses_current: usesMax,
          recharge: feature.recharge || null,
          is_active: true,
        });
      } else {
        await supabase.from('character_features').insert({
          character_id: characterId,
          name: feature.name,
          source: 'Job: Level 1',
          level_acquired: 1,
          description: feature.description,
          action_type: feature.action_type || null,
          uses_max: usesMax,
          uses_current: usesMax,
          recharge: feature.recharge || null,
          is_active: true,
        });
      }
    }
  } else {
    // Static fallback: if DB had no features, use static classFeatures
    const { data: jobRow } = await supabase
      .from('compendium_jobs')
      .select('name')
      .eq('id', jobId)
      .maybeSingle();

    const staticJob = findStaticJobByName(jobRow?.name);
    if (staticJob?.classFeatures) {
      const level1Features = staticJob.classFeatures.filter(cf => cf.level === 1);
      for (const cf of level1Features) {
        if (isLocalCharacterId(characterId)) {
          addLocalFeature(characterId, {
            name: cf.name,
            source: 'Job: Level 1',
            level_acquired: 1,
            description: cf.description,
            action_type: null,
            uses_max: null,
            uses_current: null,
            recharge: null,
            is_active: true,
          });
        } else {
          await supabase.from('character_features').insert({
            character_id: characterId,
            name: cf.name,
            source: 'Job: Level 1',
            level_acquired: 1,
            description: cf.description,
            action_type: null,
            uses_max: null,
            uses_current: null,
            recharge: null,
            is_active: true,
          });
        }
      }
    }
  }

  // Get level 1 path features if path selected
  if (pathId) {
    const { data: pathRow } = await supabase
      .from('compendium_job_paths')
      .select('path_level')
      .eq('id', pathId)
      .maybeSingle();

    if (!pathRow || pathRow.path_level !== 1) {
      return;
    }

    const { data: pathFeatures } = await supabase
      .from('compendium_job_features')
      .select('*')
      .eq('path_id', pathId)
      .eq('level', 1)
      .eq('is_path_feature', true);

    const accessiblePathFeatures = await filterRowsBySourcebookAccess(
      pathFeatures || [],
      (feature) => feature.source_name,
      { campaignId }
    );

    if (accessiblePathFeatures.length > 0) {
      for (const feature of accessiblePathFeatures) {
        const usesMax = calculateFeatureUses(feature.uses_formula, 1, 2);

        if (isLocalCharacterId(characterId)) {
          addLocalFeature(characterId, {
            name: feature.name,
            source: 'Path: Level 1',
            level_acquired: 1,
            description: feature.description,
            action_type: feature.action_type || null,
            uses_max: usesMax,
            uses_current: usesMax,
            recharge: feature.recharge || null,
            is_active: true,
          });
        } else {
          await supabase.from('character_features').insert({
            character_id: characterId,
            name: feature.name,
            source: 'Path: Level 1',
            level_acquired: 1,
            description: feature.description,
            action_type: feature.action_type || null,
            uses_max: usesMax,
            uses_current: usesMax,
            recharge: feature.recharge || null,
            is_active: true,
          });
        }
      }
    }
  }
}

/**
 * Add background proficiencies and features
 */
export async function addBackgroundFeatures(
  characterId: string,
  background: Background
): Promise<void> {
  // Add background feature if any
  if (background.feature_name) {
    if (isLocalCharacterId(characterId)) {
      addLocalFeature(characterId, {
        name: background.feature_name,
        source: `Background: ${background.name}`,
        level_acquired: 1,
        description: background.feature_description || `Background feature: ${background.feature_name}`,
        is_active: true,
      });
    } else {
      await supabase.from('character_features').insert({
        character_id: characterId,
        name: background.feature_name,
        source: `Background: ${background.name}`,
        level_acquired: 1,
        description: background.feature_description || `Background feature: ${background.feature_name}`,
        is_active: true,
      });
    }
  }
}

/**
 * Add starting equipment from job and background
 */
export async function addStartingEquipment(
  characterId: string,
  job: Job,
  background?: Background,
  equipmentChoices?: Record<number, string>
): Promise<void> {
  const campaignId = await getCharacterCampaignId(characterId);

  // Add job starting equipment from static data
  const staticJob = findStaticJobByName(job.name);
  if (staticJob?.startingEquipment) {
    for (let groupIndex = 0; groupIndex < staticJob.startingEquipment.length; groupIndex++) {
      const equipmentGroup = staticJob.startingEquipment[groupIndex];
      // Use player's choice if provided, otherwise default to first option
      const itemName = (equipmentChoices && equipmentChoices[groupIndex]) ?? equipmentGroup[0];
      if (!itemName) continue;

      // Look up item in static compendium for proper metadata
      const compendiumItem = findStaticItemByName(itemName);
      const itemType = compendiumItem ? deriveItemType(compendiumItem) : 'gear';
      // Auto-equip armor, shields, and weapons so new characters start ready
      const shouldAutoEquip = ['armor', 'shield', 'weapon'].includes(itemType);
      const equipData = compendiumItem
        ? {
            name: compendiumItem.name,
            item_type: itemType,
            weight: compendiumItem.weight ?? null,
            description: compendiumItem.description ?? null,
            properties: buildItemProperties(compendiumItem),
            rarity: (compendiumItem.rarity as 'common' | 'uncommon' | 'rare' | 'legendary' | 'very_rare') ?? null,
            quantity: 1,
            is_equipped: shouldAutoEquip,
          }
        : {
            name: itemName,
            item_type: 'gear',
            quantity: 1,
            is_equipped: false,
          };

      if (isLocalCharacterId(characterId)) {
        addLocalEquipment(characterId, equipData);
      } else {
        await supabase.from('character_equipment').insert({
          character_id: characterId,
          ...equipData,
        });
      }
    }
  }

  // Add background starting equipment (DB field)
  if (background?.starting_equipment) {
    const equipmentItems = background.starting_equipment.split(',').map(e => e.trim());
    
    for (const itemName of equipmentItems) {
      const { data: equipment } = await supabase
        .from('compendium_equipment')
        .select('*')
        .ilike('name', `%${itemName}%`)
        .limit(1)
        .maybeSingle();

      if (
        equipment &&
        (await isSourcebookAccessible(equipment.source_book, { campaignId }))
      ) {
        if (isLocalCharacterId(characterId)) {
          addLocalEquipment(characterId, {
            name: equipment.name,
            item_type: equipment.equipment_type || 'gear',
            description: equipment.description || null,
            properties: equipment.properties || [],
            weight: equipment.weight || null,
            quantity: 1,
            is_equipped: false,
          });
        } else {
          await supabase.from('character_equipment').insert({
            character_id: characterId,
            name: equipment.name,
            item_type: equipment.equipment_type || 'gear',
            description: equipment.description || null,
            properties: equipment.properties || [],
            weight: equipment.weight || null,
            quantity: 1,
            is_equipped: false,
          });
        }
      } else {
        if (isLocalCharacterId(characterId)) {
          addLocalEquipment(characterId, {
            name: itemName,
            item_type: 'gear',
            quantity: 1,
            is_equipped: false,
          });
        } else {
          await supabase.from('character_equipment').insert({
            character_id: characterId,
            name: itemName,
            item_type: 'gear',
            quantity: 1,
            is_equipped: false,
          });
        }
      }
    }
  }
}

/**
 * Add starting powers from job
 */
export async function addStartingPowers(
  characterId: string,
  job: Job
): Promise<void> {
  const campaignId = await getCharacterCampaignId(characterId);

  const maxPowerLevel = getMaxPowerLevelForJobAtLevel(job.name, 1);

  // Get powers available to this job at level 1
  const { data: powers } = await supabase
    .from('compendium_powers')
    .select('*')
    .contains('job_names', [job.name])
    .lte('power_level', maxPowerLevel); // 5e-accurate max spell level (includes cantrips at 0)

  const accessiblePowers = await filterRowsBySourcebookAccess(
    powers || [],
    (power) => power.source_book,
    { campaignId }
  );

  if (accessiblePowers.length > 0) {
    for (const power of accessiblePowers) {
      if (isLocalCharacterId(characterId)) {
        addLocalPower(characterId, {
          name: power.name,
          power_level: power.power_level,
          source: `Job: ${job.name}`,
          casting_time: power.casting_time || null,
          range: power.range || null,
          duration: power.duration || null,
          concentration: power.concentration || false,
          description: power.description || null,
          higher_levels: power.higher_levels || null,
          is_prepared: power.power_level === 0, // Auto-prepare cantrips
          is_known: true,
        });
      } else {
        await supabase.from('character_powers').insert({
          character_id: characterId,
          name: power.name,
          power_level: power.power_level,
          source: `Job: ${job.name}`,
          casting_time: power.casting_time || null,
          range: power.range || null,
          duration: power.duration || null,
          concentration: power.concentration || false,
          description: power.description || null,
          higher_levels: power.higher_levels || null,
          is_prepared: power.power_level === 0, // Auto-prepare cantrips
          is_known: true,
        });
      }
    }
  }
}
