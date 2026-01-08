/**
 * Guest-lite local persistence (1+ local characters) using localStorage.
 *
 * Goal: Allow unauthenticated users to create and use characters without Supabase writes.
 * This is intentionally deterministic and versioned to support future migrations.
 */

import type { Database } from '@/integrations/supabase/types';
import { AppError } from '@/lib/appError';

type AbilityScore = Database['public']['Enums']['ability_score'];
type CharacterRow = Database['public']['Tables']['characters']['Row'];
type CharacterInsert = Database['public']['Tables']['characters']['Insert'];
type CharacterUpdate = Database['public']['Tables']['characters']['Update'];
type EquipmentRow = Database['public']['Tables']['character_equipment']['Row'];
type EquipmentInsert = Database['public']['Tables']['character_equipment']['Insert'];
type EquipmentUpdate = Database['public']['Tables']['character_equipment']['Update'];
type PowerRow = Database['public']['Tables']['character_powers']['Row'];
type PowerInsert = Database['public']['Tables']['character_powers']['Insert'];
type PowerUpdate = Database['public']['Tables']['character_powers']['Update'];
type FeatureRow = Database['public']['Tables']['character_features']['Row'];
type FeatureInsert = Database['public']['Tables']['character_features']['Insert'];
type FeatureUpdate = Database['public']['Tables']['character_features']['Update'];
type SpellSlotRow = Database['public']['Tables']['character_spell_slots']['Row'];
type SpellSlotInsert = Database['public']['Tables']['character_spell_slots']['Insert'];
type SpellSlotUpdate = Database['public']['Tables']['character_spell_slots']['Update'];
type RuneInscriptionRow = Database['public']['Tables']['character_rune_inscriptions']['Row'];
type RuneKnowledgeRow = Database['public']['Tables']['character_rune_knowledge']['Row'];
type RollHistoryRow = Database['public']['Tables']['roll_history']['Row'];

export interface GuestCharacterState {
  character: CharacterRow;
  abilities: Record<AbilityScore, number>;
  equipment: EquipmentRow[];
  powers: PowerRow[];
  features: FeatureRow[];
  spellSlots: SpellSlotRow[];
  runeInscriptions: RuneInscriptionRow[];
  runeKnowledge: RuneKnowledgeRow[];
  rollHistory: RollHistoryRow[];
}

interface GuestStateV1 {
  version: 1;
  updatedAt: string;
  characters: Record<string, GuestCharacterState>;
}

const STORAGE_KEY = 'solo-compendium.guest.v1';

function hasLocalStorage(): boolean {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  } catch {
    return false;
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

function defaultAbilities(): Record<AbilityScore, number> {
  return {
    STR: 10,
    AGI: 10,
    VIT: 10,
    INT: 10,
    SENSE: 10,
    PRE: 10,
  };
}

export function isLocalCharacterId(id: string): boolean {
  return id.startsWith('local_');
}

export function createLocalId(prefix: string): string {
  const uuid =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? (crypto.randomUUID as () => string)()
      : `${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`;
  return `${prefix}_${uuid}`;
}

function loadGuestState(): GuestStateV1 {
  const empty: GuestStateV1 = {
    version: 1,
    updatedAt: nowIso(),
    characters: {},
  };

  if (!hasLocalStorage()) return empty;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<GuestStateV1> | null;
    if (!parsed || parsed.version !== 1 || !parsed.characters) return empty;
    return {
      version: 1,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : nowIso(),
      characters: parsed.characters as GuestStateV1['characters'],
    };
  } catch {
    return empty;
  }
}

function saveGuestState(state: GuestStateV1): void {
  if (!hasLocalStorage()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota/serialization errors; guest mode is best-effort.
  }
}

export function listLocalCharacters(): CharacterRow[] {
  const state = loadGuestState();
  return Object.values(state.characters)
    .map((c) => c.character)
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at));
}

export function getLocalCharacterState(characterId: string): GuestCharacterState | null {
  const state = loadGuestState();
  return state.characters[characterId] || null;
}

export function getLocalCharacterWithAbilities(
  characterId: string
): (CharacterRow & { abilities: Record<AbilityScore, number> }) | null {
  const entry = getLocalCharacterState(characterId);
  if (!entry) return null;
  return {
    ...entry.character,
    abilities: entry.abilities,
  };
}

export function upsertLocalCharacter(
  character: CharacterRow,
  abilities?: Record<AbilityScore, number>
): void {
  const state = loadGuestState();
  const existing = state.characters[character.id];

  state.characters[character.id] = {
    character,
    abilities: abilities || existing?.abilities || defaultAbilities(),
    equipment: existing?.equipment || [],
    powers: existing?.powers || [],
    features: existing?.features || [],
    spellSlots: existing?.spellSlots || [],
    runeInscriptions: existing?.runeInscriptions || [],
    runeKnowledge: existing?.runeKnowledge || [],
    rollHistory: existing?.rollHistory || [],
  };

  state.updatedAt = nowIso();
  saveGuestState(state);
}

export function createLocalCharacter(data: Omit<CharacterInsert, 'user_id'>): CharacterRow {
  const id = createLocalId('local');
  const now = nowIso();

  const character: CharacterRow = {
    id,
    user_id: 'guest',
    created_at: now,
    updated_at: now,

    name: data.name,
    level: data.level ?? 1,
    job: data.job ?? null,
    path: data.path ?? null,
    background: data.background ?? null,
    appearance: data.appearance ?? null,
    backstory: data.backstory ?? null,
    notes: data.notes ?? null,
    portrait_url: data.portrait_url ?? null,
    share_token: null,
    sovereign_id: data.sovereign_id ?? null,

    proficiency_bonus: data.proficiency_bonus ?? 2,
    armor_class: data.armor_class ?? 10,
    initiative: data.initiative ?? 0,
    speed: data.speed ?? 30,

    hp_current: data.hp_current ?? 1,
    hp_max: data.hp_max ?? 1,
    hp_temp: data.hp_temp ?? 0,

    hit_dice_current: data.hit_dice_current ?? 1,
    hit_dice_max: data.hit_dice_max ?? 1,
    hit_dice_size: data.hit_dice_size ?? 8,

    system_favor_current: data.system_favor_current ?? 0,
    system_favor_max: data.system_favor_max ?? 0,
    system_favor_die: data.system_favor_die ?? 4,

    saving_throw_proficiencies: data.saving_throw_proficiencies ?? null,
    skill_proficiencies: data.skill_proficiencies ?? null,
    skill_expertise: data.skill_expertise ?? null,
    armor_proficiencies: data.armor_proficiencies ?? null,
    weapon_proficiencies: data.weapon_proficiencies ?? null,
    tool_proficiencies: data.tool_proficiencies ?? null,

    conditions: data.conditions ?? null,
    exhaustion_level: data.exhaustion_level ?? 0,
    monarch_overlays: data.monarch_overlays ?? null,
  };

  upsertLocalCharacter(character);
  return character;
}

export function updateLocalCharacter(characterId: string, updates: CharacterUpdate): CharacterRow | null {
  const entry = getLocalCharacterState(characterId);
  if (!entry) return null;

  const now = nowIso();
  const next: CharacterRow = {
    ...entry.character,
    ...updates,
    // Never allow changing user_id in guest mode
    user_id: entry.character.user_id,
    updated_at: now,
  };

  upsertLocalCharacter(next, entry.abilities);
  return next;
}

export function deleteLocalCharacter(characterId: string): void {
  const state = loadGuestState();
  delete state.characters[characterId];
  state.updatedAt = nowIso();
  saveGuestState(state);
}

export function setLocalAbilities(characterId: string, abilities: Record<AbilityScore, number>): void {
  const entry = getLocalCharacterState(characterId);
  if (!entry) return;
  upsertLocalCharacter(entry.character, abilities);
}

// Equipment helpers
export function listLocalEquipment(characterId: string): EquipmentRow[] {
  const entry = getLocalCharacterState(characterId);
  return entry?.equipment || [];
}

export function addLocalEquipment(characterId: string, item: Omit<EquipmentInsert, 'character_id'>): EquipmentRow {
  const entry = getLocalCharacterState(characterId);
  if (!entry) throw new AppError('Local character not found', 'NOT_FOUND');

  const now = nowIso();
  const next: EquipmentRow = {
    id: createLocalId('local_eq'),
    character_id: characterId,
    created_at: now,
    display_order: entry.equipment.length,
    name: item.name,
    item_type: item.item_type,
    quantity: item.quantity ?? 1,
    is_equipped: item.is_equipped ?? false,
    is_attuned: item.is_attuned ?? false,
    requires_attunement: item.requires_attunement ?? false,
    description: item.description ?? null,
    properties: item.properties ?? null,
    weight: item.weight ?? null,
    value_credits: item.value_credits ?? null,
    rarity: item.rarity ?? null,
    relic_tier: item.relic_tier ?? null,
    charges_current: item.charges_current ?? null,
    charges_max: item.charges_max ?? null,
  };

  const equipment = [...entry.equipment, next];
  const character = { ...entry.character, updated_at: now };
  upsertLocalCharacter(character, entry.abilities);

  const state = loadGuestState();
  state.characters[characterId] = { ...state.characters[characterId], equipment };
  state.updatedAt = now;
  saveGuestState(state);

  return next;
}

export function updateLocalEquipment(equipmentId: string, updates: EquipmentUpdate): void {
  const state = loadGuestState();
  const entries = Object.values(state.characters);

  for (const entry of entries) {
    const idx = entry.equipment.findIndex((e) => e.id === equipmentId);
    if (idx === -1) continue;

    const now = nowIso();
    const nextEquipment = [...entry.equipment];
    nextEquipment[idx] = { ...nextEquipment[idx], ...updates };

    const characterId = entry.character.id;
    state.characters[characterId] = {
      ...state.characters[characterId],
      equipment: nextEquipment,
      character: { ...entry.character, updated_at: now },
    };
    state.updatedAt = now;
    saveGuestState(state);
    return;
  }

  throw new AppError('Equipment not found', 'NOT_FOUND');
}

export function removeLocalEquipment(equipmentId: string): void {
  const state = loadGuestState();
  const entries = Object.values(state.characters);

  for (const entry of entries) {
    const idx = entry.equipment.findIndex((e) => e.id === equipmentId);
    if (idx === -1) continue;

    const now = nowIso();
    const characterId = entry.character.id;
    const nextEquipment = entry.equipment.filter((e) => e.id !== equipmentId);

    state.characters[characterId] = {
      ...state.characters[characterId],
      equipment: nextEquipment,
      character: { ...entry.character, updated_at: now },
    };
    state.updatedAt = now;
    saveGuestState(state);
    return;
  }

  throw new AppError('Equipment not found', 'NOT_FOUND');
}

// Powers helpers
export function listLocalPowers(characterId: string): PowerRow[] {
  const entry = getLocalCharacterState(characterId);
  return entry?.powers || [];
}

export function addLocalPower(characterId: string, power: Omit<PowerInsert, 'character_id'>): PowerRow {
  const entry = getLocalCharacterState(characterId);
  if (!entry) throw new AppError('Local character not found', 'NOT_FOUND');

  const now = nowIso();
  const next: PowerRow = {
    id: createLocalId('local_power'),
    character_id: characterId,
    created_at: now,
    display_order: entry.powers.length,
    name: power.name,
    power_level: power.power_level ?? 0,
    source: power.source,
    description: power.description ?? null,
    higher_levels: power.higher_levels ?? null,
    casting_time: power.casting_time ?? null,
    range: power.range ?? null,
    duration: power.duration ?? null,
    concentration: power.concentration ?? false,
    is_prepared: power.is_prepared ?? false,
    is_known: power.is_known ?? true,
  };

  const powers = [...entry.powers, next];
  const character = { ...entry.character, updated_at: now };

  const state = loadGuestState();
  state.characters[characterId] = { ...state.characters[characterId], powers, character };
  state.updatedAt = now;
  saveGuestState(state);

  return next;
}

export function updateLocalPower(powerId: string, updates: PowerUpdate): void {
  const state = loadGuestState();
  const entries = Object.values(state.characters);

  for (const entry of entries) {
    const idx = entry.powers.findIndex((p) => p.id === powerId);
    if (idx === -1) continue;

    const now = nowIso();
    const characterId = entry.character.id;
    const nextPowers = [...entry.powers];
    nextPowers[idx] = { ...nextPowers[idx], ...updates };

    state.characters[characterId] = {
      ...state.characters[characterId],
      powers: nextPowers,
      character: { ...entry.character, updated_at: now },
    };
    state.updatedAt = now;
    saveGuestState(state);
    return;
  }

  throw new AppError('Power not found', 'NOT_FOUND');
}

export function removeLocalPower(powerId: string): void {
  const state = loadGuestState();
  const entries = Object.values(state.characters);

  for (const entry of entries) {
    const idx = entry.powers.findIndex((p) => p.id === powerId);
    if (idx === -1) continue;

    const now = nowIso();
    const characterId = entry.character.id;
    const nextPowers = entry.powers.filter((p) => p.id !== powerId);

    state.characters[characterId] = {
      ...state.characters[characterId],
      powers: nextPowers,
      character: { ...entry.character, updated_at: now },
    };
    state.updatedAt = now;
    saveGuestState(state);
    return;
  }

  throw new AppError('Power not found', 'NOT_FOUND');
}

// Features helpers (needed for builder automation)
export function listLocalFeatures(characterId: string): FeatureRow[] {
  const entry = getLocalCharacterState(characterId);
  return entry?.features || [];
}

export function addLocalFeature(characterId: string, feature: Omit<FeatureInsert, 'character_id'>): FeatureRow {
  const entry = getLocalCharacterState(characterId);
  if (!entry) throw new AppError('Local character not found', 'NOT_FOUND');

  const now = nowIso();
  const next: FeatureRow = {
    id: createLocalId('local_feat'),
    character_id: characterId,
    created_at: now,
    display_order: entry.features.length,
    name: feature.name,
    source: feature.source,
    description: feature.description ?? null,
    level_acquired: feature.level_acquired ?? 1,
    action_type: feature.action_type ?? null,
    recharge: feature.recharge ?? null,
    uses_current: feature.uses_current ?? null,
    uses_max: feature.uses_max ?? null,
    is_active: feature.is_active ?? true,
  };

  const state = loadGuestState();
  state.characters[characterId] = {
    ...state.characters[characterId],
    features: [...entry.features, next],
    character: { ...entry.character, updated_at: now },
  };
  state.updatedAt = now;
  saveGuestState(state);

  return next;
}

export function updateLocalFeature(featureId: string, updates: FeatureUpdate): void {
  const state = loadGuestState();
  const entries = Object.values(state.characters);

  for (const entry of entries) {
    const idx = entry.features.findIndex((f) => f.id === featureId);
    if (idx === -1) continue;

    const now = nowIso();
    const characterId = entry.character.id;
    const nextFeatures = [...entry.features];
    nextFeatures[idx] = { ...nextFeatures[idx], ...updates };

    state.characters[characterId] = {
      ...state.characters[characterId],
      features: nextFeatures,
      character: { ...entry.character, updated_at: now },
    };
    state.updatedAt = now;
    saveGuestState(state);
    return;
  }

  throw new AppError('Feature not found', 'NOT_FOUND');
}

// Spell slots helpers (used by spellcasting)
export function listLocalSpellSlots(characterId: string): SpellSlotRow[] {
  const entry = getLocalCharacterState(characterId);
  return entry?.spellSlots || [];
}

export function upsertLocalSpellSlot(
  characterId: string,
  insert: Omit<SpellSlotInsert, 'character_id'>
): SpellSlotRow {
  const entry = getLocalCharacterState(characterId);
  if (!entry) throw new AppError('Local character not found', 'NOT_FOUND');

  const now = nowIso();
  const existing = entry.spellSlots.find((s) => s.spell_level === insert.spell_level);

  const row: SpellSlotRow = existing
    ? {
        ...existing,
        ...insert,
        updated_at: now,
      }
    : {
        id: createLocalId('local_slot'),
        character_id: characterId,
        created_at: now,
        updated_at: now,
        spell_level: insert.spell_level,
        slots_max: insert.slots_max ?? 0,
        slots_current: insert.slots_current ?? insert.slots_max ?? 0,
        slots_recovered_on_short_rest: insert.slots_recovered_on_short_rest ?? 0,
        slots_recovered_on_long_rest: insert.slots_recovered_on_long_rest ?? 1,
      };

  const nextSlots = existing
    ? entry.spellSlots.map((s) => (s.spell_level === row.spell_level ? row : s))
    : [...entry.spellSlots, row].sort((a, b) => a.spell_level - b.spell_level);

  const state = loadGuestState();
  state.characters[characterId] = {
    ...state.characters[characterId],
    spellSlots: nextSlots,
    character: { ...entry.character, updated_at: now },
  };
  state.updatedAt = now;
  saveGuestState(state);

  return row;
}

export function updateLocalSpellSlotRow(slotId: string, updates: SpellSlotUpdate): void {
  const state = loadGuestState();
  const entries = Object.values(state.characters);

  for (const entry of entries) {
    const idx = entry.spellSlots.findIndex((s) => s.id === slotId);
    if (idx === -1) continue;

    const now = nowIso();
    const characterId = entry.character.id;
    const nextSlots = [...entry.spellSlots];
    nextSlots[idx] = { ...nextSlots[idx], ...updates, updated_at: now };

    state.characters[characterId] = {
      ...state.characters[characterId],
      spellSlots: nextSlots,
      character: { ...entry.character, updated_at: now },
    };
    state.updatedAt = now;
    saveGuestState(state);
    return;
  }

  throw new AppError('Spell slot not found', 'NOT_FOUND');
}

// Roll history (optional in guest mode)
export function listLocalRollHistory(characterId?: string): RollHistoryRow[] {
  const state = loadGuestState();
  const all = Object.values(state.characters).flatMap((c) => c.rollHistory);
  const filtered = characterId ? all.filter((r) => r.character_id === characterId) : all;
  return filtered.sort((a, b) => b.created_at.localeCompare(a.created_at));
}


