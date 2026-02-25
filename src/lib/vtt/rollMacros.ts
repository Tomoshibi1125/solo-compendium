/**
 * Roll Macro System
 *
 * Allows players to save frequently-used dice formulas as named macros.
 * Persisted via localStorage + Supabase tool state.
 */

// ─── Types ──────────────────────────────────────────────────
export interface RollMacro {
    id: string;
    name: string;          // e.g., "Greatsword Attack"
    formula: string;       // e.g., "1d20+7"
    damageFormula?: string; // e.g., "2d6+4"
    category: MacroCategory;
    characterId?: string;
    createdAt: string;
    icon?: string;         // Lucide icon name
    color?: string;
    hotkey?: string;       // e.g., "1", "2", "shift+a"
}

export type MacroCategory = 'attack' | 'damage' | 'save' | 'check' | 'healing' | 'custom';

export interface MacroBar {
    slots: (string | null)[]; // macro IDs, null = empty slot
    maxSlots: number;
}

// ─── Constants ──────────────────────────────────────────────
const MACRO_STORAGE_KEY = 'solo-compendium.macros.v1';
const DEFAULT_MAX_SLOTS = 10;

const CATEGORY_ICONS: Record<MacroCategory, string> = {
    attack: 'sword',
    damage: 'flame',
    save: 'shield',
    check: 'search',
    healing: 'heart',
    custom: 'zap',
};

const CATEGORY_COLORS: Record<MacroCategory, string> = {
    attack: '#ef4444',
    damage: '#f97316',
    save: '#3b82f6',
    check: '#8b5cf6',
    healing: '#22c55e',
    custom: '#a855f7',
};

// ─── CRUD Functions ─────────────────────────────────────────

/**
 * Create a new roll macro
 */
export function createMacro(
    name: string,
    formula: string,
    category: MacroCategory = 'custom',
    options: Partial<Pick<RollMacro, 'damageFormula' | 'characterId' | 'icon' | 'color' | 'hotkey'>> = {},
): RollMacro {
    return {
        id: `macro-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name,
        formula,
        category,
        createdAt: new Date().toISOString(),
        icon: options.icon ?? CATEGORY_ICONS[category],
        color: options.color ?? CATEGORY_COLORS[category],
        ...options,
    };
}

/**
 * Auto-generate macros from a character's stats
 */
export function generateCharacterMacros(
    characterName: string,
    characterId: string,
    stats: {
        attackBonus?: number;
        spellAttackBonus?: number;
        spellSaveDC?: number;
        damageFormula?: string;
        primaryAbilityMod?: number;
    },
): RollMacro[] {
    const macros: RollMacro[] = [];

    if (stats.attackBonus !== undefined) {
        macros.push(createMacro(
            `${characterName} Attack`,
            `1d20+${stats.attackBonus}`,
            'attack',
            { characterId, damageFormula: stats.damageFormula, hotkey: '1' },
        ));
    }

    if (stats.spellAttackBonus !== undefined) {
        macros.push(createMacro(
            `${characterName} Spell Attack`,
            `1d20+${stats.spellAttackBonus}`,
            'attack',
            { characterId, hotkey: '2' },
        ));
    }

    if (stats.spellSaveDC !== undefined) {
        macros.push(createMacro(
            `Spell Save DC ${stats.spellSaveDC}`,
            `DC ${stats.spellSaveDC}`,
            'save',
            { characterId, hotkey: '3' },
        ));
    }

    // Common saves
    const abilityMod = stats.primaryAbilityMod ?? 0;
    macros.push(createMacro(
        `Initiative`,
        `1d20+${abilityMod}`,
        'check',
        { characterId, hotkey: '0' },
    ));

    return macros;
}

// ─── Persistence ────────────────────────────────────────────

/**
 * Save macros to localStorage
 */
export function saveMacrosToLocal(macros: RollMacro[]): void {
    try {
        localStorage.setItem(MACRO_STORAGE_KEY, JSON.stringify(macros));
    } catch (e) {
        console.warn('[Macros] Failed to save:', e);
    }
}

/**
 * Load macros from localStorage
 */
export function loadMacrosFromLocal(): RollMacro[] {
    try {
        const stored = localStorage.getItem(MACRO_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.warn('[Macros] Failed to load from localStorage:', e);
        return [];
    }
}

/**
 * Create a default macro bar
 */
export function createDefaultMacroBar(macros: RollMacro[]): MacroBar {
    const slots: (string | null)[] = new Array(DEFAULT_MAX_SLOTS).fill(null);
    macros.slice(0, DEFAULT_MAX_SLOTS).forEach((macro, i) => {
        slots[i] = macro.id;
    });
    return { slots, maxSlots: DEFAULT_MAX_SLOTS };
}

/**
 * Get macro by hotkey
 */
export function getMacroByHotkey(macros: RollMacro[], hotkey: string): RollMacro | undefined {
    return macros.find((m) => m.hotkey === hotkey);
}
